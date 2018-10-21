import {addDays, addHours, addMinutes, startOfDay} from 'date-fns';
import {CalendarEvent} from 'angular-calendar';


export const timeTableEvents: CalendarEvent[] = [
  {
    start: addMinutes(addHours(addDays(startOfDay(new Date()), 1), 17), 30),
    end: addMinutes(addHours(addDays(startOfDay(new Date()), 1), 18), 30),
    title: 'Erőnléti Kittivel',
    color: {primary: '#be4a47', secondary: '#ff4a47'},
    id: 'Erőnléti Kittivel' + Math.random(),
    cssClass: 'event-element'
  },
  {
    start: addMinutes(addHours(addDays(startOfDay(new Date()), 1), 18), 30),
    end: addMinutes(addHours(addDays(startOfDay(new Date()), 1), 19), 30),
    title: 'Standard Edzés',
    color: {primary: '#6495ed', secondary: '#6495ff'},
    id: 'Standard Edzés' + Math.random(),
    cssClass: 'event-element'
  },
  {
    start: addMinutes(addHours(addDays(startOfDay(new Date()), 2), 18), 30),
    end: addMinutes(addHours(addDays(startOfDay(new Date()), 2), 19), 30),
    title: 'Standard Közös óra',
    color: {primary: '#03396c', secondary: '#03398f'},
    id: 'Standard Közös óra' + Math.random(),
    cssClass: 'event-element'
  },
  {
    start: addMinutes(addHours(addDays(startOfDay(new Date()), 3), 17), 30),
    end: addMinutes(addHours(addDays(startOfDay(new Date()), 3), 18), 30),
    title: 'Erőnléti Ádámmal',
    color: {primary: '#8b3a3a', secondary: '#cb3a3a'},
    id: 'Erőnléti Ádámmal' + Math.random(),
    cssClass: 'event-element'
  },
  {
    start: addMinutes(addHours(addDays(startOfDay(new Date()), 3), 18), 30),
    end: addMinutes(addHours(addDays(startOfDay(new Date()), 3), 19), 30),
    title: 'Latin Edzés',
    color: {primary: '#ed7f00', secondary: '#ff7f00'},
    id: 'Latin Edzés' + Math.random(),
    cssClass: 'event-element'
  },
  {
    start: addMinutes(addHours(addDays(startOfDay(new Date()), 4), 17), 30),
    end: addMinutes(addHours(addDays(startOfDay(new Date()), 4), 18), 30),
    title: 'Zumba',
    color: {primary: '#cc98e5', secondary: '#cf98ef'},
    id: 'Zumba' + Math.random(),
    cssClass: 'event-element'
  },
  {
    start: addMinutes(addHours(addDays(startOfDay(new Date()), 4), 18), 30),
    end: addMinutes(addHours(addDays(startOfDay(new Date()), 4), 19), 30),
    title: 'Latin Közös óra',
    color: {primary: '#ffd700', secondary: '#ffd755'},
    id: 'Latin Közös óra' + Math.random(),
    cssClass: 'event-element'
  },
  {
    start: addMinutes(addHours(addDays(startOfDay(new Date()), 5), 17), 30),
    end: addMinutes(addHours(addDays(startOfDay(new Date()), 5), 18), 30),
    title: 'Standard Edzés',
    color: {primary: '#6495ed', secondary: '#6495ff'},
    id: 'Standard Edzés' + Math.random(),
    cssClass: 'event-element'
  },
  {
    start: addMinutes(addHours(addDays(startOfDay(new Date()), 5), 18), 30),
    end: addMinutes(addHours(addDays(startOfDay(new Date()), 5), 19), 30),
    title: 'Latin Edzés',
    color: {primary: '#ed7f00', secondary: '#ff7f00'},
    id: 'Latin Edzés' + Math.random(),
    cssClass: 'event-element'
  }];
