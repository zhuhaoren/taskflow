/**
 * TaskFlow v0.2
 * 在 v0.1 基础上补充：任务完成状态切换、localStorage 本地持久化
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'taskflow.tasks';

  var tasks = load();
  var seq = tasks.reduce(function (max, task) {
    return Math.max(max, task.id);
  }, 0);

  var input = document.getElementById('task-input');
  var addBtn = document.getElementById('add-btn');
  var list = document.getElementById('task-list');
  var emptyState = document.getElementById('empty-state');

  function load() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('读取本地任务失败，已重置为空列表', err);
      return [];
    }
  }

  function save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.warn('保存本地任务失败', err);
    }
  }

  function render() {
    list.innerHTML = '';

    tasks.forEach(function (task) {
      var li = document.createElement('li');
      li.className = 'task-item' + (task.done ? ' task-item--done' : '');

      var check = document.createElement('button');
      check.className = 'task-item__check';
      check.type = 'button';
      check.setAttribute('aria-label', task.done ? '标记为未完成' : '标记为已完成');
      check.addEventListener('click', function () {
        toggleTask(task.id);
      });

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

      li.appendChild(check);
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
    tasks.push({ id: ++seq, text: value, done: false });
    save();
    render();
  }

  function toggleTask(id) {
    tasks.forEach(function (task) {
      if (task.id === id) {
        task.done = !task.done;
      }
    });
    save();
    render();
  }

  function removeTask(id) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    save();
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
