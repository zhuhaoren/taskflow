/**
 * TaskFlow v1.0.0
 * 新增：任务筛选（全部 / 进行中 / 已完成）、完成率统计
 * 修复：筛选状态持久化，刷新后保持上次选择的视图
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'taskflow.tasks';
  var FILTER_KEY = 'taskflow.filter';
  var FILTERS = ['all', 'active', 'done'];

  var tasks = load();
  var seq = tasks.reduce(function (max, task) {
    return Math.max(max, task.id);
  }, 0);
  var currentFilter = loadFilter();

  var input = document.getElementById('task-input');
  var addBtn = document.getElementById('add-btn');
  var list = document.getElementById('task-list');
  var emptyState = document.getElementById('empty-state');
  var filters = document.getElementById('filters');
  var statTotal = document.getElementById('stat-total');
  var statActive = document.getElementById('stat-active');
  var statDone = document.getElementById('stat-done');
  var statRate = document.getElementById('stat-rate');

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

  function loadFilter() {
    try {
      var raw = window.localStorage.getItem(FILTER_KEY);
      return FILTERS.indexOf(raw) > -1 ? raw : 'all';
    } catch (err) {
      return 'all';
    }
  }

  function saveFilter() {
    try {
      window.localStorage.setItem(FILTER_KEY, currentFilter);
    } catch (err) {
      console.warn('保存筛选状态失败', err);
    }
  }

  function visibleTasks() {
    if (currentFilter === 'active') {
      return tasks.filter(function (task) {
        return !task.done;
      });
    }
    if (currentFilter === 'done') {
      return tasks.filter(function (task) {
        return task.done;
      });
    }
    return tasks;
  }

  function updateStats() {
    var done = tasks.filter(function (task) {
      return task.done;
    }).length;
    var total = tasks.length;

    statTotal.textContent = total;
    statActive.textContent = total - done;
    statDone.textContent = done;
    statRate.textContent = total === 0 ? '0%' : Math.round((done / total) * 100) + '%';
  }

  function render() {
    list.innerHTML = '';

    visibleTasks().forEach(function (task) {
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

    emptyState.classList.toggle('empty-state--hidden', visibleTasks().length > 0);
    updateStats();
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

  function syncFilterTabs() {
    Array.prototype.forEach.call(filters.querySelectorAll('.filters__tab'), function (tab) {
      tab.classList.toggle('is-active', tab.dataset.filter === currentFilter);
    });
  }

  function setFilter(next) {
    currentFilter = FILTERS.indexOf(next) > -1 ? next : 'all';
    saveFilter();
    syncFilterTabs();
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

  filters.addEventListener('click', function (event) {
    var tab = event.target.closest('.filters__tab');
    if (tab) {
      setFilter(tab.dataset.filter);
    }
  });

  syncFilterTabs();
  render();
})();
