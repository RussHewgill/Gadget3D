<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchEvents, type marketEvent } from '../scripts/fetchEvents';
  import { format, isValid } from 'date-fns';

  let isLoading = true;
  let events: marketEvent[] = [];

  async function fetchData() {
    try {
      events = await fetchEvents();
      isLoading = false;
    } catch (error) {
      console.log(error);
    }
  }

  onMount(fetchData);

  function formatTime(event: marketEvent) {
    // console.log("formatting time: ", event);
    try {
        const time_start = format(event.time_start, "h:mm a");
        const time_end = format(event.time_end, "h:mm a");
        return `${time_start} - ${time_end}`;
      } catch (error) {
        const time_start = format(event.time_start, "h:mm a");
        return time_start;
      }
  }

</script>

<div class="relative overflow-x-auto py-8">
  {#if isLoading}
    <p>Loading Events...</p>
  {:else}
    <table id="eventTable" class="w-full text-sm text-left">
      <thead class="text-xs uppercase bg-light-accent">
        <tr>
          <th class=".event-th">Event</th>
          <!-- <th class=".event-th">Days until</th> -->
          <th class=".event-th">Start Date</th>
          <th class=".event-th">End Date</th>
          <th class=".event-th">Time</th>
          <th class=".event-th">Location</th>
        </tr>
      </thead>
      <tbody id="eventTableBody">
        {#each events as event (event.id)}
          <tr class="event-tr even:bg-dark-accent">
            <td class="event-td">{event.name}</td>
            <!-- <td class="event-td">{}</td> -->
            <td class="event-td">{format(event.date_start, "yyyy-MM-dd")}</td>
            {#if isValid(event.date_end)}
              <td class="event-td">{format(event.date_end, "yyyy-MM-dd")}</td>
            {:else}
              <td class="event-td"></td>
            {/if}
            <td class="event-td">{formatTime(event)}</td>
            <td class="event-td">{event.location}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  /* even:bg-gray-200 */
</style>