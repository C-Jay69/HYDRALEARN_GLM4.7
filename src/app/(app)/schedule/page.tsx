'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash2, Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required.'),
  eventType: z.enum(['lesson', 'exam', 'assignment', 'event']),
  color: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type ScheduleEvent = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  eventType: string;
  color: string | null;
  createdAt: string;
  updatedAt: string;
};

const eventColors = {
  lesson: 'bg-blue-100 text-blue-800 border-blue-300',
  exam: 'bg-red-100 text-red-800 border-red-300',
  assignment: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  event: 'bg-green-100 text-green-800 border-green-300',
};

export default function SchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      eventType: 'lesson',
      color: '#3399CC',
    },
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/schedule');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load schedule events.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      if (editingEvent) {
        // Update existing event
        const response = await fetch(`/api/schedule/${editingEvent.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          toast({ title: 'Event updated successfully!' });
          setEvents(
            events.map((e) =>
              e.id === editingEvent.id ? { ...response.json(), ...data } : e
            )
          );
        }
      } else {
        // Create new event
        const response = await fetch('/api/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const newEvent = await response.json();
          setEvents([...events, newEvent]);
          toast({ title: 'Event created successfully!' });
        }
      }

      setIsDialogOpen(false);
      setEditingEvent(null);
      form.reset();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save event.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/schedule/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter((e) => e.id !== id));
        toast({ title: 'Event deleted successfully!' });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete event.',
      });
    }
  };

  const openCreateDialog = () => {
    setEditingEvent(null);
    form.reset({
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      eventType: 'lesson',
      color: '#3399CC',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (event: ScheduleEvent) => {
    setEditingEvent(event);
    form.reset({
      title: event.title,
      description: event.description || '',
      date: format(new Date(event.date), 'yyyy-MM-dd'),
      eventType: event.eventType as any,
      color: event.color || '#3399CC',
    });
    setIsDialogOpen(true);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const selectedDate = form.watch('date');
  const selectedDateEvents = selectedDate
    ? getEventsForDate(new Date(selectedDate))
    : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Class Schedule</h1>
          <p className="text-muted-foreground">
            Manage your lesson calendar, exams, and important dates.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <Calendar
              mode="single"
              selected={selectedDate ? new Date(selectedDate) : undefined}
              onSelect={(date) => {
                if (date) {
                  form.setValue('date', format(date, 'yyyy-MM-dd'));
                }
              }}
              className="[&_td]:w-full [&_td]:h-28 [&_td_>_div]:w-full [&_td_>_div]:h-full [&_td_>_div]:justify-start [&_td_>_div]:items-start [&_td_>_div]:p-2"
              modifiers={{
                hasEvent: (date) => getEventsForDate(date).length > 0,
              }}
              modifiersStyles={{
                hasEvent: {
                  backgroundColor: '#3399CC',
                  color: 'white',
                  fontWeight: 'bold',
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events for Selected Date</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <p className="text-muted-foreground">Loading events...</p>
            ) : selectedDateEvents.length === 0 ? (
              <p className="text-muted-foreground">
                No events scheduled for this date.
              </p>
            ) : (
              selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border ${
                    eventColors[event.eventType as keyof typeof eventColors]
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {event.eventType}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{event.title}</h4>
                      {event.description && (
                        <p className="text-sm mt-1">{event.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(event)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </DialogTitle>
            <DialogDescription>
              {editingEvent
                ? 'Update the event details below.'
                : 'Fill in the details to add a new event to your schedule.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Math Quiz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lesson">Lesson</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add details about this event..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
