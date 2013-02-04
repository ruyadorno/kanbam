define(['jquery', 'plugins', 'exports', 'bootstrap', 'tool', 'jqueryui'], function($, plugins, exports, bootstrap, tool, jqueryui){
    var self;

    exports.init = function($scope) {
        var kanbam = new Kanbam($scope);
        kanbam.startEvents();
        kanbam.start();
        
        self = kanbam;
    }
    
    var Kanbam = function($scope) {
        this.$scope = $scope;
        this.self = this;
    }
    
    Kanbam.prototype.start = function() {
        this.$scope.kanbam = self;
    
        this.currentPostIt = -1;
        this.currentStory = 0;
        this.currentActivity = 0;
        this.$scope.editTask = { assigned_to_id : -1, assigned_to_name : "Select an user" };
    
        this.$scope.colors = ["", "red", "blue", "green", "purple", "orange", "gray"];
        this.$scope.settings = { appURI : "//" + window.location.host + window.location.pathname };
        
        this.getCookiesSettings();
        
        this.$scope.tool = tool;
        this.$scope.tool.init(this.$scope, this);
        
        if ( this.$scope.settings.apiKey == undefined ) {
            $("#settingsModal").modal();
        } else {
            $("#redmineURI").val( this.$scope.settings.redmineURI );
            $("#apiKey").val( this.$scope.settings.apiKey );
            
            this.$scope.tool.start();
        }
        
        $(".menu").stop().animate({ bottom: -40 }, 50, 'easeOutQuad' );
        
        this.$scope.formatHour = function(hour, isZero) {
            if ( hour == 0 || hour == undefined ) {
                if ( isZero ) {
                    return "0h";
                } else {
                    return "";
                }
            } else {
                return hour + "h";
            }
        }
        
        this.$scope.formatUserName = function(name) {
            return String(name).split(" ")[0];
        }
        
        this.$scope.formatColorPost = function(id) {
            return self.getActivityColorById(id);
        }
        
        this.$scope.getColorByVariation = function(variation) {
            if ( ( variation <= 10 ) && ( variation >= 0 ) ) {
                return "label-warning";
            } else if ( variation < 0 ) {
                return "label-success";
            } else {
                return "label-important";
            }
        }
        
        this.$scope.formatVariation = function(variation) {
            if ( variation == null ) {
                variation = 0;
            }
            
            if ( ( variation >= 1000 ) || ( variation <= -1000 ) ) {
               variation =  (variation / 1000).toFixed(1) + "K";
            }
            
            return variation;
        }
    }
    
    Kanbam.prototype.startEvents = function() {
        this.isMenuOpen = false;
    
        $(".saveSettings").click( this.saveSettings );
         
        $(".settingsBtn .btn").click( function() {
            $("#settingsModal").modal();
        });
        
        $(window).mousemove(function(e) {
            if ( !$(".menuItems .dropdown-menu").is(":visible") ) {
                if (e.clientY >= $(window).height() - 150) {
                    if (!self.isMenuOpen) {
                        $(".menu").stop().animate({ bottom: 0 }, 250, 'easeOutQuad'  );
                    }
                    self.isMenuOpen = true;
                } else {
                    if (self.isMenuOpen) {
                        $(".menu").stop().animate({ bottom: -40 }, 50, 'easeOutQuad' );
                    }
                    self.isMenuOpen = false;
                }
            }
        });
        
        $("#addTaskForm").submit(function() {
            if ( $("#taskName").val() == "" ) { 
                alert("Insert a correct task name.");
                return false;
            }
            
            if ( isNaN( $("#taskHours").val() ) ) { 
                alert("Insert only numbers in task hours.");
                return false;
            }
            
            if ( self.currentActivity == 0 ) { 
                alert("Choose a activity for your task.");
                return false;
            }
            
            if ( self.currentStory == 0 ) { 
                alert("Choose a story for your task.");
                return false;
            }
            
            self.$scope.tool.addTask({
                name : $("#taskName").val(),
                story_id : Number( self.currentStory ),
                story_name : $(".taskStory .btn-label").html(),
                type : self.currentActivity,
                estimated : Number( $("#taskHours").val() )
            });
            
            $("#taskName").val("");
            $("#taskHours").val("");
            $(".newTaskDetail #taskName").focus();
            
            return false;
        });
        
        $("#addStoryForm").submit(function() {
            if ( $("#storyName").val() == "" ) { 
                alert("Insert a correct story name.");
                return false;
            }
            
            self.$scope.tool.addStory( $("#storyName").val() );
            
            $("#storyName").val("");
            
            return false;
        });
        
        $(".newTask a").click(function(e) {
            e.preventDefault();
            
            $(".menuDetail").hide("fast");
            $(".menu .menuItems .item a").removeAttr("style");
            
            $(".newTaskDetail").css("overflow", "auto").show("fast", function() {
                $(this).css("overflow", "visible");
            });
            
            $(this).attr("style", "pointer-events: none;");
            
            $(".newTaskDetail #taskName").focus();
        });
        
        $(".newTaskDetail #taskCancel").click(function() {
            $(".newTaskDetail").hide("fast");
            $(".newTask a").removeAttr("style");
        });
        
        $(".newStory a").click(function(e) {
            e.preventDefault();
            
            $(".menuDetail").hide("fast");
            $(".menu .menuItems .item a").removeAttr("style");
            
            $(".newStoryDetail").css("overflow", "auto").show("fast", function() {
                $(this).css("overflow", "visible");
            });
            
            $(this).attr("style", "pointer-events: none;");
            
            $(".newStoryDetail #storyName").focus();
        });
        
        $(".newStoryDetail #storyCancel").click(function() {
            $(".newStoryDetail").hide("fast");
            $(".newStory a").removeAttr("style");
        });
        
        $(".settingsBtn .btn").click( function() {
            $("#settingsModal").modal();
        });
        
        $(".popupTaskDetail .btnAddSpent").click(function(e) {
            e.preventDefault();
            
            self.addSpentTime();
        });
        
        $(".popup").click(function() {
            $(this).hide();
            $(".popupTaskDetail").fadeOut("fast");
            self.$scope.tool.reload();
        });
    }
    
    Kanbam.prototype.projectsEvents = function() {
        $(".changeProject ul li a").click(function(e) {
            e.preventDefault();
            self.$scope.tool.changeProject( $(this).attr("id") );
        });
        
        $(".taskActivity ul li a").click(function(e) {
            e.preventDefault();
            
            $(".taskActivity .btn-label").html( $(this).html() );
            
            self.currentActivity = $(this).attr("id");
        });
    }
    
    Kanbam.prototype.tasksEvents = function() {
        $(".content").droppable({
            accept: ".post-it",
            drop: function( e, ui ) {
                var dragArea = $(this);
                var postIt = $(ui.draggable);
                var postItId = postIt.attr("id").split("post")[1];
                var status = dragArea.attr("id");
                
                dragArea.append(postIt);
                postIt.attr("style", "position:relative;");
                dragArea.removeClass("contentHover");
                
                self.$scope.tool.changeStatusTask({
                    id : postItId,
                    status : status,
                    story : dragArea.parent().attr("id")
                });
                
                if ( status == "DONE" ) {
                    self.showEditTask(postItId);
                } else {
                    self.hideEditTask();
                }
                
                self.fixStoryCell();
            },
            over: function( e, ui ) { $(this).addClass("contentHover"); },
            out: function( e, ui ) { $(this).removeClass("contentHover"); }
        });
        
        $(".taskStory ul li a").click(function(e) {
            e.preventDefault();
            
            $(".taskStory .btn-label").html( $(this).html() );
            
            self.currentStory = $(this).attr("id");
        });
    }
    
    Kanbam.prototype.editEvents = function() {
        $(".popupTaskDetail .closePopover").click( function(e) { 
            e.preventDefault();
            self.hideEditTask(e);
        });
        
        $(".popupTaskDetail .removeTask").click( function(e) {
            e.preventDefault();
            
            $(".popupTaskDetail").fadeOut("fast"); 
            $('#post' + self.$scope.editTask.id).slideUp('fast');
            self.$scope.tool.removeTask( self.$scope.editTask.id );
        });
        
        $(".popupTaskDetail .updateTaskDetail").click( function(e) {
            e.preventDefault();
            self.updateTaskDetail( self.$scope.editTask.id ); 
        });
        
        $(".popupTaskDetail .memberships ul li a").click(function(e) {
            e.preventDefault();
            
            self.$scope.editTask.assigned_to_id = $(this).attr("id");
            self.$scope.editTask.assigned_to_name = $(this).html();
            $(".popupTaskDetail .memberships .btn-label").html( $(this).html() );
        });
        
        $(".popupTaskDetail .spentTimesActivities ul li a").click(function(e) {
            e.preventDefault();
            
            self.$scope.editTask.spent_time_activity_id = $(this).attr("id");
            self.$scope.editTask.spent_time_activity_name = $(this).html();
            $(".popupTaskDetail .spentTimesActivities .btn-label").html( $(this).html() );
        });
        
        this.spentTimeEvents();
    }
    
    Kanbam.prototype.spentTimeEvents = function() {
        $(".popupTaskDetail .deleteSpentTime").click(function(e){
            e.preventDefault();
            
            self.$scope.tool.removeSpentTime( $(this).attr("id") );
        });
    }
    
    Kanbam.prototype.saveSettings = function() {
        var redmineURI = $("#redmineURI");
        var apiKey = $("#apiKey");
    
        if (redmineURI.val() == "") {
            redmineURI.parent().parent().addClass("error");
            redmineURI.parent().find(".help-inline").slideDown("fast");
            
            return false;
        } else {
            redmineURI.parent().parent().removeClass("error");
            redmineURI.parent().find(".help-inline").slideUp("hide");
        }
        
        if (apiKey.val() == "") {
            apiKey.parent().parent().addClass("error");
            apiKey.parent().find(".help-inline").slideDown("fast");
            
            return false;
        } else {
            apiKey.parent().parent().removeClass("error");
            apiKey.parent().find(".help-inline").slideUp("fast");
        }
        
        self.$scope.settings.apiKey     = apiKey.val();
        self.$scope.settings.redmineURI = redmineURI.val();
        self.$scope.settings.tool       = "redmine";
        
        $.cookie("apiKey", self.$scope.settings.apiKey);
        $.cookie("redmineURI", self.$scope.settings.redmineURI);
        $.cookie("tool", self.$scope.settings.tool);
        
        $("#settingsModal").modal("hide");
        
        self.$scope.tool.start();
    }
    
    Kanbam.prototype.addSpentTime = function() {
        var spentHours = $(".popupTaskDetail .spentHours");
    
        if ( spentHours.val() == "" ) {
            $(".errorSpentActivity").show("fast");
            return false;
        } else {
            
        }
        
        if ( self.$scope.editTask.spent_time_activity_name == undefined ) {
            $(".errorSpentActivity").show("fast");
            return false;
        } else {
            spentHours.parent().parent().removeClass("error");
        }
        
        $(".errorSpentActivity").hide("fast");
    
        self.$scope.tool.addSpentTime({
            issueId : self.$scope.editTask.id,
            hours : spentHours.val(),
            activityId : self.$scope.editTask.spent_time_activity_id,
            activityName : self.$scope.editTask.spent_time_activity_name
        });
    }
    
    Kanbam.prototype.renderTasks = function() {
        for (h in this.$scope.stories) {
            var groupColumns = [
                this.$scope.stories[h].todo, 
                this.$scope.stories[h].doing, 
                this.$scope.stories[h].done
            ];
            
            for (gc in groupColumns) {
                for (t in groupColumns[gc]) {
                    var postIt = $( "#post" + (groupColumns[gc][t].id) );
                    
                    postIt.bind('dblclick', this.doubleClickPostIt);
                    
                    postIt.draggable({
                        revert: "invalid", 
                        containment: "document", 
                        cursor: "move", 
                        zIndex: 1000, 
                        drag : function(e, ui) {
                            this.currentPostIt = $(this);
                        }
                    });
                }    
            }
        }
        
        this.fixStoryCell();
        this.tasksEvents();
    }
    
    Kanbam.prototype.doubleClickPostIt = function(e) {
        self.onUpdateData();
        self.showEditTask(e.currentTarget.id.split("post")[1]);
    }
    
    Kanbam.prototype.showEditTask = function(id) {
        var task = _.find( self.$scope.tasks, function(task){ return task.id == id } );
                
        self.$scope.editTask = task;
        
        if (self.$scope.editTask.assigned_to_name == "") {
            $(".popupTaskDetail .memberships .btn-label").html( "Select an user" );
        } else {
            $(".popupTaskDetail .memberships .btn-label").html( self.$scope.editTask.assigned_to_name );
        }
        
        self.onUpdateData();
    
        $(".popupTaskDetail").show();
        
        $(".popupTaskDetail .spentTimesActivities .btn-label").html( "Select an activity" );
        
        $(".popupTaskDetail .spentHours").val("");
        $(".popupTaskDetail .spentHours").focus();
        
        $(".updateOther").click(function(e) {
            e.preventDefault();
            
            $(".popup iframe").attr("src", self.$scope.settings.redmineURI + "issues/" + id);
            $(".popup").fadeIn("fast");
        });
        
        this.movePositionPopover(id);
        
        this.editEvents();
    }
    
    Kanbam.prototype.hideEditTask = function(e) {
        $(".popupTaskDetail").fadeOut("fast");
    }
    
    Kanbam.prototype.movePositionPopover = function( id ) {
        var pop = $(".popupTaskDetail");
        var post = $("#post" + id);
        var stories = $(".stories");
        var posXPop, posYPop = 0;
        var headHeight = $(".head").height() + $(".project").height();
        
        if ( $(window).width() - ( post.offset().left + post.width() ) > pop.width() ) {
            posXPop = post.offset().left + post.width() + 10;
            pop.removeClass("left");
            pop.addClass("right");
        } else {
            posXPop = post.offset().left - pop.width() - 10;
            pop.removeClass("right");
            pop.addClass("left");
        }
        
        posYPop = post.offset().top - ( pop.height() / 2 ) + ( post.height() / 2 );
        
        if ( posYPop < headHeight ) {
            posYPop = headHeight + 5;
        }
        
        if ( posYPop > $(document).height() - pop.height() - 60 - 10 ) {
            posYPop = $(document).height() - pop.height() - 60 - 10;
        }
        
        pop.offset({ 
            top : posYPop,
            left : posXPop
        });
        
        $(".popupTaskDetail .arrow").offset({
            top : post.offset().top + ( post.height() / 2 ) - 10
        });
        
        $('html, body').animate({ scrollTop: pop.offset().top - headHeight - 10 }, 300);
    }
    
    Kanbam.prototype.updateTaskDetail = function( id ) {
        if ( $(".popover #taskNameEdit").val().trim() == "" ) {
            $(".popover #taskNameEdit").parent().parent().addClass("error");
            
            return false;
        } else {
            $(".popover #taskNameEdit").parent().parent().removeClass("error");
        }
        
        if ( 
            ( isNaN( $(".popover #taskEstimatedHours").val()) ) ||
            ( parseFloat($(".popover #taskEstimatedHours").val() ) < 0 ) 
        ) {
            $(".popover #taskEstimatedHours").parent().parent().addClass("error");
            
            return false;
        } else {
            $(".popover #taskEstimatedHours").parent().parent().removeClass("error");
        }
        
        $(".popover").slideUp("fast");
        
        self.$scope.tool.updateTask({
            id : id, 
            name : $(".popover #taskNameEdit").val(), 
            estimated : Number( $(".popover #taskEstimatedHours").val() ),
            assigned_to_id : self.$scope.editTask.assigned_to_id, 
            assigned_to_name : self.$scope.editTask.assigned_to_name 
        });
    }
    
    Kanbam.prototype.onUpdateData = function() {
        this.$scope.$apply();
    }
    
    Kanbam.prototype.showError = function(message) {
        $(".alert").fadeIn("fast");
        $(".alert-message").html( message );
    }
    
    Kanbam.prototype.getCookiesSettings = function() {
        this.$scope.settings.apiKey     = $.cookie("apiKey");
        this.$scope.settings.redmineURI = $.cookie("redmineURI");
        this.$scope.settings.tool       = $.cookie("tool");
        
        this.$scope.currentProject = { id : $.cookie("lastProjectId"), name : $.cookie("lastProjectName") };
    }
    
    Kanbam.prototype.getActivityColorById = function(id) {
        for (i = 0; i < this.$scope.activities.length; i++) {
            if (this.$scope.activities[ i ].id == id) {
                return this.$scope.colors[ i ];
            }
        }
    }
    
    Kanbam.prototype.fixStoryCell = function() {
        $(".content").attr("style", "width:" + parseInt( ( $(window).width() - $(".labelStory").width() ) / 3 ) + "px !important" )
    }
});