const resources = {
  common: {
    errors: {
      graphql: {
        title: "Произошла ошибка",
      },
      network: {
        title: "Ошибка соединения",
        message: "Попробуйте позже",
      },
    },
    validation: {
      required: "Обязательное поле",
      min: "Минимальная длина ${min}",
      max: "Максимальная длина ${max}",
      email: "Введите корректный email",
    },
    calendar: {
      sameDay: "[Сегодня в] HH:mm",
      lastDay: "[Вчера в] HH:mm",
      nextDay: "[Завтра в] HH:mm",
      lastWeek: "DD MMMM [в] HH:mm",
      nextWeek: "DD MMMM [в] HH:mm",
      sameElse: "DD MMMM [в] HH:mm",
    },
  },
  emotions: {
    joy: {
      title: "Радость",
      description:
        "Чувство удовольствия, счастья, удовлетворения и благополучия.",
    },
    sadness: {
      title: "Грусть",
      description:
        "Чувство печали, тоски, разочарования, потери или безнадежности.",
    },
    anger: {
      title: "Злость",
      description:
        "Чувство гнева, раздражения, ярости, негодования и агрессии.",
    },
    fear: {
      title: "Страх",
      description: "Чувство тревоги, беспокойства, испуга, опасности и угрозы.",
    },
    surprise: {
      title: "Удивление",
      description:
        "Чувство изумления, неожиданности, внезапности и ошеломления.",
    },
    disgust: {
      title: "Отвращение",
      description:
        "Чувство неприязни, отторжения, брезгливости, отвращения и нежелания.",
    },
    guilt: {
      title: "Вина",
      description:
        "Чувство ответственности за проступок, сожаления о содеянном, раскаяния и самоосуждения.",
    },
    shame: {
      title: "Стыд",
      description:
        "Чувство неловкости, смущения, унижения, дискомфорта и неадекватности.",
    },
    calm: {
      title: "Спокойствие",
      description:
        "Чувство умиротворения, расслабления, гармонии, безмятежности и покоя.",
    },
    interest: {
      title: "Интерес",
      description:
        "Чувство любопытства, заинтересованности, увлеченности, внимания и стимуляции.",
    },
  },
  entry: {
    create: {
      title: "Добавить запись",
      next: "Добавить",
    },
    update: {
      title: "Обновить запись",
      next: "Сохранить",
    },
    form: {
      emotion: {
        title: "Что я чувствую?",
        caption: "Выберите наиболее сильную эмоцию, которую вы ощущаете",
      },
      situation: {
        title: "Что произошло?",
        placeholder: 'Н-р, "Завтра важная встреча с клиентом"',
        caption: "Кратко опишите ситуацию",
      },
      thoughts: {
        title: "Автоматические мыслы",
        placeholder: 'Н-р, "Я провалю презентацию, и они будут недовольны"',
        caption: "Запишите свои спонтанные мысли, которые пришли вам в голову",
      },
      toasts: {
        created: "Запись создана 🎉",
        updated: "Запись обновлена 🎉",
        failed: "Произошла ошибка",
      },
    },
  },
  onboarding: {
    title: "Soul AI",
    subtitle: "Know yourself, \nGrow yourself",
    next: "Начать",
  },
  auth: {
    index: {
      title: "Вход",
      description: "Введите email для входа",
      placeholder: "Ваш email",
      continue: "Получить код",
      codeSendedToast: "Код отправлен",
      codeSendFailed: "Произошла ошибка при отправке кода",
    },
    oneTimeCode: {
      title: "Код",
      description: "Отправлен на почту {{email}}",
      resendCode: "Отправить код снова",
      resendCodeWait: "Отправить код снова ({{value}} сек)",
      toasts: {
        success: {
          title: "Вы вошли в аккаунт 😉",
        },
        failed: {
          title: "Неверный код",
        },
      },
    },
    form: {
      createProfile: "Заполните профиль",
      updateProfile: "Настройка профиля",
      continue: "Продолжить",
      save: "Сохранить",
      avatarCaption: "Нажмите, чтобы загрузить фото",
      nameInputPlaceholder: "Имя",
      nameInputCaption: "Ваше имя",
      toasts: {
        created: {
          title: "Вы вошли в аккаунт 😉",
        },
        updated: {
          title: "Профиль обновлен ✨",
        },
        failed: {
          title: "Произошла ошибка",
        },
      },
    },
  },
  notifications: {
    title: "Уведомления",
  },
  home: {
    title: 'MentalApp',
    bots: 'AI помощники',
    posts: 'Статьи',
  },
  chats: {
    title: "Чаты",
    noChats: {
      title: 'Нет чатов',
      description: 'Создайте новый',
    },
    selectAssistant: 'Выберите AI помощника',
  },
  chat: {
    inputPlaceholder: 'Введите сообщение',
  },
  profile: {
    title: "Профиль",
    edit: "Редактировать",
    entries: "Последние записи",
    seeAll: 'См. все',
    entry: {
      edit: 'Редактировать',
      chat: 'Обсудить',
      remove: 'Удалить',
    },
  },
  posts: {
    noPosts: {
      title: 'Нет материалов',
    },
  },
  entries: {
    title: 'Записи',
  },
  settings: {
    title: "Настройки",
    logout: "Выйти",
  },
} as const;

export default resources;
