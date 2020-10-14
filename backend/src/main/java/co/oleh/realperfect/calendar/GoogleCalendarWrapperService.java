package co.oleh.realperfect.calendar;

import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.RequestScope;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequestScope
@AllArgsConstructor
public class GoogleCalendarWrapperService {
    private final Optional<Calendar> maybeCalendar;

    public void listAllUserGCalendarsEvents() throws IOException {
        if (maybeCalendar.isPresent()) {
            Calendar calendar = maybeCalendar.get();

            String pageToken = null;
            do {
                CalendarList calendarList = null;
                calendarList = calendar.calendarList().list().setPageToken(pageToken).execute();
                List<CalendarListEntry> items = calendarList.getItems();
                for (CalendarListEntry calendarListEntry : items) {
                    System.out.print("CalendarListEntry:" + calendarListEntry.getId());
                    listEventsForCalendarList(calendarListEntry.getId());
                }
                pageToken = calendarList.getNextPageToken();
            } while (pageToken != null);
        }
    }

    public void addEventToPrimaryCalendar(Event event) throws IOException {
        if (maybeCalendar.isPresent()) {
            Calendar calendar = maybeCalendar.get();
            calendar.events().insert("primary", event).execute();
        }
    }

    public void addTestEventToPrimaryCalendar() throws IOException {
        Event event = new Event();
        event.setSummary("Test Event Summary");
        event.setDescription("Test Event Description");
        event.setStart(new EventDateTime().setDateTime(new DateTime("2020-04-01T07:00:00+00:00")));
        event.setEnd(new EventDateTime().setDateTime(new DateTime("2020-04-01T10:00:00+00:00")));

        addEventToPrimaryCalendar(event);
    }

    public void listEventsForCalendarList(String calendarListEntryId) throws IOException {
        if (maybeCalendar.isPresent()) {
            Calendar calendar = maybeCalendar.get();

            String eventPageToken = null;
            do {
                Events events = null;
                events = calendar.events().list(calendarListEntryId).setPageToken(eventPageToken).execute();
                List<Event> eventsItems = events.getItems();
                for (Event event : eventsItems) {
                    System.out.println(event.getSummary());
                }
                eventPageToken = events.getNextPageToken();
            } while (eventPageToken != null);
        }
    }
}
