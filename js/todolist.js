var App = (function(){

    var todos = null;

    /* Firebase Database Rule Read/Write must be true */

    // Initialize Firebase
    var config = {

        apiKey: "AIzaSyANueGIlPh0aSVOS7cKseMKC39xhAsl3JM",
    authDomain: "homepage-c3b5e.firebaseapp.com",
    projectId: "homepage-c3b5e",
    storageBucket: "homepage-c3b5e.appspot.com",
    messagingSenderId: "313476801849",
    appId: "1:313476801849:web:dec2a5f71d273e05d634e8",
    measurementId: "G-B3XMV4KECF",
        databaseURL: "gs://homepage-c3b5e.appspot.com"
    };

    /* 綁定事件 */
    function _bindEvent() {
        console.log("Event binding now...");
        $('#add').on('click', _handleAddEvent);
        // 綁定條件在 class='todolist'底下且擁有class='delete-icon'之元素
        $('#todolist').on('click', '.card-block .delete-icon', _handleDeleteEvent)
        $('#clear').on('click', _clear);
        console.log("Event binding sucessful!");
    }

    /* 新增TODO */
    function _handleAddEvent() {
        let content = $('#inputContent').val();
        let title = '快速便籤';
        todos.push({
            'title': title,
            'time': Date(),
            'content': content
        });
        $('#inputContent').val('');
    }

    /* 刪除TODO */
    function _handleDeleteEvent() {
        let key = $(this).parents('.card-block').attr('data-key');
        todos.child(key).remove();
    }

    /* TODOs 渲染 */
    function _renderTodo() {
        console.log(snapshot.val());
        let list = $('#todolist');
        todos.on('value', function(snapshot){
            list.html('');
            $('.loading').css('display', 'block');
            $('.container-fluid').css('display', 'none');
            let data = snapshot.val();
            for(let key in data) {
                console.log(data[key]);
//                 list.append(`
//                 <div class="card m-2">
//                     <div class="card-block p-2" data-key="${key}">
//                         <div class="d-flex mb-2 justify-content-between">
//                             <span class="h4 mb-0 card-title">${data[key].title} <small class="h6 text-muted">${data[key].time}</small></span>
//                             <i class="delete-icon mt-1 mr-1 justify-content-end fas fa-times"></i>
//                         </div>
//                         <p class="card-text">${data[key].content}</p>
//                     </div>
//                 </div>
//                 `);
            }
            $('.loading').css('display', 'none');
            $('.container-fluid').css('display', 'block');
        });
        console.log("Render sucessful!");
    }

    function _clear() {
        todos.set({});
        console.log("Clear sucessful!");
    }

    function init() {
        console.log("Initialzating!");
        firebase.initializeApp(config);
        todos = firebase.database().ref('todos');
        _bindEvent();
        _renderTodo();
        console.log("Initialzation sucessful!");
    }

    return {
        init
    };
})();
