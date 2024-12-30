import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import calendar from 'dayjs/plugin/calendar';
import ru from 'dayjs/locale/ru';


dayjs.extend(customParseFormat)
dayjs.extend(calendar)
dayjs.locale(ru)

export {
  dayjs
}
