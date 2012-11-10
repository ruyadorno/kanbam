<!DOCTYPE html>
<!--[if lt IE 7]>      <html data-ng-app="Kanbam" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html data-ng-app="Kanbam" class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html data-ng-app="Kanbam" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html data-ng-app="KanbamApp" class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Kanb.am</title>
        <meta name="description" content="Kanbam Tool for project management tools">
        <meta name="viewport" content="width=device-width">

        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <link href='http://fonts.googleapis.com/css?family=Dosis:200,300,400,600,800' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">
        <link rel="stylesheet" href="css/style.css" >
        
        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body ng-controller="Kanbam">
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->

        <!-- Add your site or application content here -->
        <div class="main">
            <div class="loading">reloading...</div>
            <div class="project">
                <div class="title">{{currentProject.name}}</div>
                <div class="detailRight">
                    <div class="hoursProject">
                        <span class="labelHours">estimated:</span> {{currentProject.totalEstimated}}h<br />
                        <span class="labelHours">executed:</span> {{currentProject.totalSpent}}h
                    </div>
                    <div class="errorProject">
                        <div class="labelError">variation</div>
                        <div class="valueError">{{currentProject.variation}}%</div>
                    </div>
                    <div class="progressProject progress">
                        <div class="bar bar-warning" style="width: {{currentProject.totalTodo}}%;" title="todo">{{currentProject.totalTodo}}%</div>
                        <div class="bar bar-info" style="width: {{currentProject.totalDoing}}%;" title="doing">{{currentProject.totalDoing}}%</div>
                        <div class="bar bar-success" style="width: {{currentProject.totalDone}}%;" title="done">{{currentProject.totalDone}}%</div>
                    </div>
                    <div class="changeProject">
                        <div class="btn-group">
                            <button class="btn btn-label btn-inverse">My Projects</button>
                            <button class="btn btn-inverse dropdown-toggle" data-toggle="dropdown">
                                <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu">
                                <li ng-repeat="project in projects" ng-switch on="project.parentName">
                                    <a href="#" ng-click="changeProject(project.id);" ng-switch-when="" style="padding-left:12px;font-weight:600;">{{project.name}}</a>
                                    <a href="#" ng-click="changeProject(project.id);" ng-switch-default style="padding-left:22px;">{{project.name}}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="settingsBtn">
                        <button class="btn btn-inverse" type="button"><i class="icon-wrench icon-white"></i></button>
                    </div>
                </div>
            </div>
            <div class="head">
                <table>
                    <tr>
                        <th class="colHistories">HISTORIES</th>
                        <th class="column">TODO</th>
                        <th class="column">DOING</th>
                        <th class="column">DONE</th>
                    </tr>
                </table>
            </div>
            <div class="histories">
                <table>
                    <colgroup>
                        <col class="colHistories"/>
                        <col class="colTodo column"/>
                        <col class="colDoing column"/>
                        <col class="colDone column"/>
                    </colgroup>
                    <tbody>
                        <tr id="{{task.id}}" ng-repeat="task in tasks">
                            <td class="labelHistory">
                                <div class="labelHistoryBox">
                                    {{task.name}}<br />
                                    <span class="estimatedTime">Estimated: {{task.total_estimated}}h</span>
                                </div>
                            </td>
                            <td id="TODO" class="todo content">
                                <div id="post{{post.id}}" class="post-it post-it-{{post.type}}" ng-repeat="post in task.todo">
                                    <div class="task">#{{post.id}}</div>
                                    <div class="assigned_to">{{post.assigned_to_name}}</div>
                                    <div class="name">{{post.name}}</div>
                                    <div class="hours">{{post.estimated}}h</div>
                                </div>
                            </td>
                            <td id="DOING" class="doing content">
                                <div id="post{{post.id}}" class="post-it post-it-{{post.type}}" ng-repeat="post in task.doing">
                                    <div class="task">#{{post.id}}</div>
                                    <div class="assigned_to">{{post.assigned_to_name}}</div>
                                    <div class="name">{{post.name}}</div>
                                    <div class="hours">{{post.estimated}}h</div>
                                </div>
                            </td>
                            <td id="DONE" class="done content">
                                <div id="post{{post.id}}" class="post-it post-it-{{post.type}}" ng-repeat="post in task.done">
                                    <div class="task">#{{post.id}}</div>
                                    <div class="assigned_to">{{post.assigned_to_name}}</div>
                                    <div class="name">{{post.name}}</div>
                                    <div class="hours">{{post.estimated}}h</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="popup">
                <iframe src="" width="80%" height="600"></iframe>
            </div>
            <div class="menu">
                <div class="menuToggle">
                    <div class="menuToggleArea">                        
                        <div class="icon"></div>
                        <div class="area"></div>
                    </div>
                </div>
                <div class="menuItems">
                    <div class="left">
                        <div class="newTask item">
                            <a href="#"><i class="icon-pencil icon-white"></i> New Task</a>
                            <div class="newTaskDetail menuDetail">
                                <input id="taskName" type="text" placeholder="Task name" />
                                <div class="btn-group taskHistory">
                                    <button class="btn btn-label btn-danger">História 1</button>
                                    <button class="btn btn-danger dropdown-toggle" data-toggle="dropdown">
                                        <span class="caret"></span>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a href="#">História 1</a></li>
                                        <li><a href="#">História 2</a></li>
                                        <li><a href="#">História 3</a></li>
                                        <li><a href="#">História 4</a></li>
                                    </ul>
                                </div>
                                <button class="btn btn-danger" type="button">Save</button>
                                <button id="taskCancel" class="btn btn-link" type="button">Cancel</button>
                            </div>
                        </div>
                        <div class="newHistory item">
                            <a href="#"><i class="icon-align-justify icon-white"></i> New History</a>
                            <div class="newHistoryDetail menuDetail">
                                <input id="historyName" type="text" placeholder="History name" />
                                <button class="btn btn-danger" type="button">Save</button>
                                <button id="historyCancel" class="btn btn-link" type="button">Cancel</button>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="deleteTask item">
                            <i class="icon-trash icon-white"></i> Drop to Remove
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="settingsModal" class="modal hide fade">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <span class="title">Kanb.am Settings</span>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal">
                        <div class="control-group">
                            <label class="control-label" for="inputEmail">Choice a Tool:</label>
                            <div class="controls">
                                <div class="btn-group toolOptions">
                                    <button class="btn btn-label">Redmine</button>
                                    <button class="btn dropdown-toggle" data-toggle="dropdown">
                                        <span class="caret"></span>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a href="#">Redmine</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="redmineURI">Redmine URI:</label>
                            <div class="controls">
                                <input type="text" class="input-xlarge" id="redmineURI" placeholder="http://" value="https://todos.olh.am/"><br />
                                <span class="help-inline">Ex: http://myredmine.mydomain.com/</span>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="apiKey">Redmine API Key:</label>
                            <div class="controls">
                                <input type="text" class="input-xlarge" id="apiKey" placeholder="Paste your API Key here" value="62de5239a7d9a370afad56cdf20177235ef77374"><br />
                                <span class="help-inline">Ex: 62de5239a7d9a370afad56cdf20177235ef77374</span>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
                    <button class="btn btn-primary saveSettings">Save changes</button>
                </div>
            </div>
            
            <div class="popoverTemplate">
                <form class="form-horizontal">
                    <div class="control-group">
                        <label class="control-label" for="taskNameEdit">Task Name:</label>
                        <div class="controls">
                            <input type="text" class="input-xlarge" id="taskNameEdit" placeholder="Type your task name" value="{{openTask.name}}" />
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label" for="inputEmail">Assigned To:</label>
                        <div class="controls">
                            <div class="btn-group memberships">
                                <button class="btn btn-label">Select a user</button>
                                <button class="btn dropdown-toggle" data-toggle="dropdown">
                                    <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu assignedToList">
                                    <li ng-repeat="member in currentProject.memberships"><a href="#">{{member.name}}</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label" for="taskEstimatedHours">Estimated:</label>
                        <div class="controls">
                            <input type="text" class="input-mini hours" id="taskEstimatedHours" placeholder="0" value="{{openTask.estimated_hours}}" />
                            <span class="help-inline">hs</span>
                        </div>
                    </div>
                    <hr />
                    <div class="control-group">
                        <label class="control-label" for="apiKey">Add Time:</label>
                        <div class="controls">
                            <input type="text" class="input-mini hours" id="apiKey" placeholder="0" value="0" />
                            <span class="help-inline">hs</span>
                        
                            <div class="btn-group toolOptions addTime">
                                <button class="btn btn-label">Select a activity</button>
                                <button class="btn dropdown-toggle" data-toggle="dropdown">
                                    <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a href="#">Design</a></li>
                                </ul>
                            </div>                          
                        </div>
                    </div>
                    <hr />
                    <div class="control-group">
                        <div class="footerLeft">
                            <a href="#" class="updateOther">Advanced options</a>
                        </div>
                        <div class="footerRight">
                            <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
                            <button class="btn btn-primary saveSettings">Save changes</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        
        
        
        
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
       
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.8.2.min.js"><\/script>')</script>
        <script src="js/bootstrap.min.js"></script>
        <script src="js/plugins.js"></script>
        <script src="js/underscore-min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.2/angular.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.0/jquery-ui.min.js"></script>
        <script src="js/script.js"></script>
        <script src="js/kanbam.js"></script>

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>
    </body>
</html>
