const tasks = {
  /* action tiek izsaukts, kad notiek notikums click (dokumentā) */
    action(e) { /* e notikuma objekts event */
      const target = e.target; /*elements uz kura tiek uzklikšķināts */
      /*ja uzklikšķina uz tasks_action, izpilda zemāk norādītos nosacījumus */
      if (target.classList.contains('tasks_action')) {/*saņemam darbību, kas ir jāizpilda (tā mums atrodās data-tasks-action) */
        const action = target.dataset.tasksAction;
        const elemItem = target.closest('.tasks_item'); /*atrodam elementu .tasks__item un saglabājām kā elemItem*/
        if (action === 'deleted' && elemItem.dataset.tasksState === 'deleted') {
          elemItem.remove();/*ja ir delete, tad izdzēšam */
        } else {
          elemItem.dataset.tasksState = action;/*Pretējā gadījumā elementa tasks_item atribūtam data-tasks-state piešķirsim ipašību action*/
        }
        this.save();/*Saglabā izmaiņas iekš localStorage */
        /* uzklikšķinot uz tasks_add, izpilda this.add un this.save */
      } else if (target.classList.contains('tasks_add')) {
        this.add();/*pievieno jaunu uzdevumu tasks_items */
        this.save();/*saglabā visus uzdevumus (tasks_items saturu) iekš localStorage */
      }
    },
    /* Nospiežot add(), tas pievieno uzdevumu sarakstam .tasks__items.*/
    add() {
      const elemText = document.querySelector('.tasks_text');
      if (elemText.disabled || !elemText.value.length) {
        return;
      }
      document.querySelector('.tasks_items').insertAdjacentHTML('beforeend', this.create(elemText.value));
      elemText.value = '';
    },
    /* Izveido uzdevumu (tekstu) HTML kodā. */
    create(text) {
      return `<ul class="tasks_item" data-tasks-state="active">
        <span class="tasks_task">${text}</span>
        <span class="tasks_action tasks_action_restore" data-tasks-action="active"></span>
        <span class="tasks_action tasks_action_complete" data-tasks-action="completed"></span>
        <span class="tasks_action tasks_action_delete" data-tasks-action="deleted"></span></ul>`;
    },
    /*Saņem datus no localStorage un ieliek tos iekš tasks__items*/
    init() {
      const fromStorage = localStorage.getItem('tasks');
      if (fromStorage) {
        document.querySelector('.tasks_items').innerHTML = fromStorage;
      }
      /*Piešķir notikumu change elementam .tasks__options, apstr.update*/
      document.querySelector('.tasks_options').addEventListener('change', this.update);
      /*Piešķir notikumu click document-am, apstr. action. Norādot this.action ar bind palīdzību tekošo kontekstu uzstādam kā this. Lai varētu iekš action() saņemt objektu tasks ar this palīdzību.*/
      document.addEventListener('click', this.action.bind(this));
    },
    /* Izmanto kā apstrādātāju. Izsaukuma gadījumā elementa .tasks__items atribūtam data-tasks-option nozīmē izvēlētas opcijas vērtību <select>, kā arī elementa .tasks__text vērtību īpašībai disabled.*/
    update() {
      const option = document.querySelector('.tasks_options').value;
      document.querySelector('.tasks_items').dataset.tasksOption = option;
      document.querySelector('.tasks_text').disabled = option !== 'active';
    },
    /* Saņem saturu no .tasks__items un ievieto to localStorage */
    save() {
      localStorage.setItem('tasks', document.querySelector('.tasks_items').innerHTML);
    }
  }
  /*Lai tasks strādātu, jāizsauc init */
  tasks.init();
