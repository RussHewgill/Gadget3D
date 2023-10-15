
// const { parse, format } = require('date-fns');
import { parse, format } from 'date-fns';
import { supabase } from '../supabase';

export interface marketEvent {
  organizer: string;
  name: string;
  location: string;
  date_start: Date;
  date_end: Date;
  time_start: Date;
  time_end: Date;
  event_link: string;
  poster_link: string;
}

export async function fetchEvents(): string[] {
  const { data, error } = await supabase
  .from('events')
  .select()
  .order('date_start', { ascending: true });
  if (error) {
    console.error(error)
  }

  const events: marketEvent[] = [];

  data.forEach((item) => {

    events.push({
      organizer: item.organizer,
      name: item.name,
      location: item.location,
      date_start: parse(item.date_start, "yyyy-MM-dd", new Date()),
      date_end: parse(item.date_end, "yyyy-MM-dd", new Date()),
      time_start: parse(item.time_start, "HH:mm:ss", new Date()),
      time_end: parse(item.time_end, "HH:mm:ss", new Date()),
      event_link: item.event_link,
      poster_link: item.poster_link,
    });

  });

  // events.sort

  return events;

}

