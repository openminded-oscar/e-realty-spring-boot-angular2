package co.oleh.realperfect.calendar;

import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.mapping.ObjectReviewDto;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.RequestScope;

import java.io.IOException;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Date;
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

    public void addReviewToUserCalendar(ObjectReviewDto reviewDto, SpringSecurityUser user) throws IOException {
        Event event = GoogleCalendarWrapperService.constructEventForObjectReview(reviewDto, user);
        this.addReviewToUserCalendar(event);
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

    public static Event constructEventForObjectReview(ObjectReviewDto review, SpringSecurityUser user) {
        Event event = new Event();
        event.setSummary("Realty review from RealPerfect");
        event.setDescription("Please make sure to be on time!");
        Date startDateTime = Date.from(review.getDateTime().atZone(ZoneId.systemDefault()).toInstant());
        Instant plusOneHour = review.getDateTime()
                .atZone(ZoneId.systemDefault())  // Convert to ZonedDateTime using the system default zone
                .plusHours(1)                    // Add 1 hour
                .toInstant();                    // Convert back to Instant
        Date endDateTime = Date.from(plusOneHour);
        event.setStart(new EventDateTime().setDateTime(new DateTime(startDateTime)));
        event.setEnd(new EventDateTime().setDateTime(new DateTime(endDateTime)));

        return event;
    }

    private void addReviewToUserCalendar(Event event) throws IOException {
        if (maybeCalendar.isPresent()) {
            Calendar calendar = maybeCalendar.get();
            calendar.events().insert("primary", event).execute();
        }
    }
}
