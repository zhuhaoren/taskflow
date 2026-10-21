/**
 * TaskFlow v0.1
 * 第一个可运行版本：任务录入与列表渲染
 */
(function () {
  'use strict';

  var tasks = [];
  var seq = 0;

  var input = document.getElementById('task-input');
  var addBtn = document.getElementById('add-btn');
  var list = document.getElementById('task-list');
  var emptyState = document.getElementById('empty-state');

  function render() {
    list.innerHTML = '';

    tasks.forEach(function (task) {
      var li = document.createElement('li');
      li.className = 'task-item';

      var span = document.createElement('span');
      span.className = 'task-item__text';
      span.textContent = task.text;

      var del = document.createElement('button');
      del.className = 'task-item__delete';
      del.type = 'button';
      del.textContent = '删除';
      del.addEventListener('click', function () {
        removeTask(task.id);
      });

      li.appendChild(span);
      li.appendChild(del);
      list.appendChild(li);
    });

    emptyState.classList.toggle('empty-state--hidden', tasks.length > 0);
  }

  function addTask(text) {
    var value = text.trim();
    if (!value) {
      return;
    }
    tasks.push({ id: ++seq, text: value });
    render();
  }

  function removeTask(id) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    render();
  }

  addBtn.addEventListener('click', function () {
    addTask(input.value);
    input.value = '';
    input.focus();
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      addTask(input.value);
      input.value = '';
    }
  });

  render();
})();
