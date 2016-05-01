angular.module("fireideaz",["firebase","ngDialog","lvl.directives.dragdrop","ngSanitize"]),angular.module("fireideaz").service("Auth",function(){function e(e,t){n.unauth(),n.authWithPassword({email:e+"@fireideaz.com",password:e},function(e,n){e?(console.log("Log user failed: ",e),window.location.hash="",location.reload()):t(n)})}function t(t,o){n.createUser({email:t+"@fireideaz.com",password:t},function(n){n?console.log("Create user failed: ",n):e(t,o)})}var n=new Firebase("https://blinding-torch-6662.firebaseio.com");return{createUserAndLog:t,logUser:e}}),angular.module("fireideaz").directive("enterClick",function(){return{restrict:"A",link:function(e,t){t.bind("keydown",function(e){13===e.keyCode&&e.shiftKey&&(e.preventDefault(),$(t[0]).find("button").focus(),$(t[0]).find("button").click())})}}}),angular.module("fireideaz").service("FirebaseService",["$firebaseArray",function(e){function t(t){return e(t)}function n(){return Firebase.ServerValue.TIMESTAMP}function o(e){return new Firebase(l+"/messages/"+e)}function r(e,t){return new Firebase(l+"/messages/"+e+"/"+t)}function a(e){return new Firebase(l+"/boards/"+e)}function i(e){return new Firebase(l+"/boards/"+e+"/columns")}var l="https://blinding-torch-6662.firebaseio.com";return{newFirebaseArray:t,getServerTimestamp:n,getMessagesRef:o,getMessageRef:r,getBoardRef:a,getBoardColumns:i}}]),angular.module("fireideaz").controller("MainCtrl",["$scope","$filter","$window","Utils","Auth","$rootScope","FirebaseService",function(e,t,n,o,r,a,i){function l(t){e.userId=n.location.hash.substring(1)||"499sm";var o=i.getMessagesRef(e.userId),r=i.getBoardRef(e.userId);r.on("value",function(t){e.board=t.val(),e.boardId=a.boardId=t.val().boardId,e.boardContext=a.boardContext=t.val().boardContext}),e.boardRef=r,e.userUid=t.uid,e.messages=i.newFirebaseArray(o),e.loading=!1}function s(){window.location.href=window.location.origin+window.location.pathname+"#"+e.userId}function d(e){var t=e.key();angular.element($("#"+t)).scope().isEditing=!0,$("#"+t).find("textarea").focus()}if(e.loading=!0,e.messageTypes=o.messageTypes,e.utils=o,e.newBoard={name:""},e.userId=n.location.hash.substring(1)||"",e.sortField="$id",e.selectedType=1,""!==e.userId){var u=i.getMessagesRef(e.userId);r.logUser(e.userId,l)}else e.loading=!1;e.isColumnSelected=function(t){return parseInt(e.selectedType)===parseInt(t)},e.seeNotification=function(){localStorage.setItem("funretro1",!0)},e.showNotification=function(){return!localStorage.getItem("funretro1")&&""!==e.userId},e.boardNameChanged=function(){e.newBoard.name=e.newBoard.name.replace(/\s+/g,"")},e.getSortOrder=function(){return"votes"===e.sortField},e.toggleVote=function(e,t){localStorage.getItem(e)?(u.child(e).update({votes:t-1,date:i.getServerTimestamp()}),localStorage.removeItem(e)):(u.child(e).update({votes:t+1,date:i.getServerTimestamp()}),localStorage.setItem(e,1))},e.createNewBoard=function(){e.loading=!0,o.closeAll(),e.userId=o.createUserId();var t=function(t){var n=i.getBoardRef(e.userId);n.set({boardId:e.newBoard.name,date_created:(new Date).toString(),columns:e.messageTypes,user_id:t.uid}),s(),e.newBoard.name=""};r.createUserAndLog(e.userId,t)},e.changeBoardContext=function(){e.boardRef.update({boardContext:e.boardContext})},e.addNewColumn=function(t){e.board.columns[o.getNextId(e.board)-1]={value:t,id:o.getNextId(e.board)};var n=i.getBoardColumns(e.userId);n.set(o.toObject(e.board.columns)),o.closeAll()},e.changeColumnName=function(t,n){e.board.columns[t-1]={value:n,id:t};var r=i.getBoardColumns(e.userId);r.set(o.toObject(e.board.columns)),o.closeAll()},e.deleteLastColumn=function(){e.board.columns.pop();var t=i.getBoardColumns(e.userId);t.set(o.toObject(e.board.columns)),o.closeAll()},e.deleteMessage=function(t){e.messages.$remove(t),o.closeAll()},e.addNewMessage=function(t){e.messages.$add({text:"",user_id:e.userUid,type:{id:t.id},date:i.getServerTimestamp(),votes:0}).then(d)},e.deleteCards=function(){$(e.messages).each(function(t,n){e.messages.$remove(n)}),o.closeAll()},e.getBoardText=function(){if(e.board){var n="";return $(e.board.columns).each(function(o,r){n+=0===o?"<strong>"+r.value+"</strong><br />":"<br /><strong>"+r.value+"</strong><br />";var a=t("orderBy")(e.messages,e.sortField,e.getSortOrder());$(a).each(function(e,t){t.type.id===r.id&&(n+="- "+t.text+" ("+t.votes+" votes) <br />")})}),n}return""},angular.element(n).bind("hashchange",function(){e.loading=!0,e.userId=n.location.hash.substring(1)||"",r.logUser(e.userId,l)})}]),angular.module("fireideaz").controller("MessageCtrl",["$scope","$filter","$window","Utils","Auth","$rootScope","FirebaseService",function(e,t,n,o,r,a,i){e.utils=o,e.userId=n.location.hash.substring(1),e.droppedEvent=function(t,n){t!==n&&(e.dragEl=t,e.dropEl=n,o.openDialogMergeCards(e))},e.dropped=function(t,n){var r=$("#"+t),a=$("#"+n),l=i.getMessageRef(e.userId,a.attr("messageId")),s=i.getMessageRef(e.userId,r.attr("messageId"));l.once("value",function(e){s.once("value",function(t){l.update({text:e.val().text+" | "+t.val().text,votes:e.val().votes+t.val().votes}),s.remove(),o.closeAll()})})}}]),angular.module("fireideaz").service("Utils",["ngDialog",function(e){function t(){for(var e="",t="abcdefghijklmnopqrstuvwxyz0123456789",n=0;5>n;n++)e+=t.charAt(Math.floor(Math.random()*t.length));return e}function n(e){return localStorage.getItem(e)}function o(e){$("#"+e).find("textarea").focus()}function r(e,t){return t.length===e&&t.length>3}function a(e){return e.columns[e.columns.length-1].id+1}function i(t){e.open({template:"addNewColumn",className:"ngdialog-theme-plain",scope:t})}function l(t){e.open({template:"addNewBoard",className:"ngdialog-theme-plain",scope:t})}function s(t){e.open({template:"deleteCard",className:"ngdialog-theme-plain",scope:t})}function d(t){e.open({template:"deleteColumn",className:"ngdialog-theme-plain",scope:t})}function u(t){e.open({template:"mergeCards",className:"ngdialog-theme-plain",scope:t})}function c(t){e.open({template:"copyBoard",className:"ngdialog-theme-plain bigDialog",scope:t})}function m(t){e.open({template:"deleteCards",className:"ngdialog-theme-plain danger",scope:t})}function g(){e.closeAll()}function f(e){for(var t={},n=0;n<e.length;n++)t[n]={id:e[n].id,value:e[n].value};return t}var p=[{id:1,value:"Went well"},{id:2,value:"To improve"},{id:3,value:"Action items"}];return{createUserId:t,alreadyVoted:n,focusElement:o,messageTypes:p,showRemoveColumn:r,getNextId:a,openDialogColumn:i,openDialogBoard:l,openDialogDeleteCard:s,openDialogDeleteColumn:d,openDialogMergeCards:u,openDialogCopyBoard:c,openDialogDeleteCards:m,closeAll:g,toObject:f}}]),angular.module("fireideaz").directive("analytics",[function(){return{templateUrl:"components/analytics.html",controller:"MainCtrl"}}]),angular.module("fireideaz").directive("boardContext",[function(){return{templateUrl:"components/boardContext.html",controller:"MainCtrl"}}]),angular.module("fireideaz").directive("dialogs",[function(){return{templateUrl:"components/dialogs.html",controller:"MainCtrl"}}]),angular.module("fireideaz").directive("pageFooter",[function(){return{templateUrl:"components/footer.html",controller:"MainCtrl"}}]),angular.module("fireideaz").directive("pageHeader",[function(){return{templateUrl:"components/header.html",controller:"MainCtrl"}}]),angular.module("fireideaz").directive("mainContent",[function(){return{templateUrl:"components/mainContent.html",controller:"MainCtrl"}}]),angular.module("fireideaz").directive("mainPage",[function(){return{templateUrl:"components/mainPage.html",controller:"MainCtrl"}}]),angular.module("fireideaz").directive("menu",[function(){return{templateUrl:"components/menu.html",controller:"MainCtrl"}}]),angular.module("fireideaz").directive("newFeatureNotification",[function(){return{templateUrl:"components/newFeatureNotification.html",controller:"MainCtrl"}}]),angular.module("fireideaz").directive("spinner",[function(){return{templateUrl:"components/spinner.html",controller:"MainCtrl"}}]),angular.module("fireideaz").directive("userVoice",[function(){return{templateUrl:"components/userVoice.html",controller:"MainCtrl"}}]);