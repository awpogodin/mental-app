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
  chats: {
    title: "Чаты",
    search: "Поиск",
    type: {
      events: "Вечеринки",
      personal: "Личные",
    },
  },
  profile: {
    title: "Профиль",
    edit: "Редактировать",
  },
  settings: {
    title: "Настройки",
    logout: "Выйти",
  },
} as const;

export default resources;
