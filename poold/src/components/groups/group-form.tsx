'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface GroupFormValues {
  name: string;
  description: string;
}

export function GroupForm() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<GroupFormValues>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: GroupFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Get the current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Insert the new group into the database
      const { data: group, error } = await supabase
        .from('groups')
        .insert({
          name: data.name,
          description: data.description,
          created_by: userData.user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add the creator as a member of the group
      await supabase.from('group_members').insert({
        group_id: group.id,
        user_id: userData.user.id,
        role: 'admin', // The creator is automatically an admin
      });

      // Redirect to the group page
      router.push(`/dashboard/groups/${group.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error creating group:', error);
      // You could add toast notifications here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Group</CardTitle>
        <CardDescription>Start pooling subscriptions with friends</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Netflix Crew" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="For splitting our Netflix subscription" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 