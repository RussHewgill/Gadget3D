// const calendar = require('@googleapis/calendar')
// import { calendar } from '@googleapis/calendar'
// import { google } from 'googleapis'
import { parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export interface marketEvent {
  id: number;
  // organizer: string;
  name: string;
  location: string;
  date_start: Date;
  date_end: Date;
  // time_start: Date;
  // time_end: Date;
  // event_link: string;
  // poster_link: string;
}

// fetch events from google calendar API
export async function fetchEvents(calender_api_key: string, calender_id: string): Promise<marketEvent[]> {
  try {

    const request = `https://www.googleapis.com/calendar/v3/calendars/${calender_id}/events?key=${calender_api_key}`;
    console.log("request = ", request);
    console.log("fetching events");
    const response = 
      await fetch(request);
    const data = await response.json();

    // console.log("data = ", data);

    let events: marketEvent[] = [];
    data['items']?.forEach((item: any) => {

      // console.log("item = ", item);

      let startDate = parseISO(item.start.dateTime);
      startDate = utcToZonedTime(startDate, item.start.timeZone);

      let endDate = parseISO(item.end.dateTime);
      endDate = utcToZonedTime(endDate, item.start.timeZone);

      // console.log("zonedDate = ", startDate);

      // let start = parse(item.start.dateTime, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", new Date(), { locale});

      let event: marketEvent = {
        id: item.id,
        name: item.summary,
        location: item.location,
        date_start: startDate,
        date_end: endDate,
      };

      events.push(event);
    });

    return events;
  } catch (err) {
    // document.getElementById('content').innerText = err.message;
    console.error("error fetching events: ", err);
    throw err;
  }

}


// // fetch events from google calendar API
// export async function fetchEvents(): Promise<marketEvent[]> {
  
// }


