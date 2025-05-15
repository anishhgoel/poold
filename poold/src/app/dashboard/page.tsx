'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface Group {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        // Get the current user's groups
        const { data: groupMembers, error: memberError } = await supabase
          .from('group_members')
          .select('group_id')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '');

        if (memberError) throw memberError;

        if (groupMembers?.length) {
          const groupIds = groupMembers.map(gm => gm.group_id);
          const { data: groupsData, error: groupsError } = await supabase
            .from('groups')
            .select('*')
            .in('id', groupIds);

          if (groupsError) throw groupsError;
          setGroups(groupsData || []);
        } else {
          setGroups([]);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [supabase]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border border-zinc-200 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Your Groups</h2>
          {isLoading ? (
            <p className="text-zinc-500">Loading groups...</p>
          ) : groups.length > 0 ? (
            <div className="space-y-3">
              {groups.map((group) => (
                <div key={group.id} className="p-3 border border-zinc-100 rounded flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{group.name}</h3>
                    <p className="text-sm text-zinc-500">{group.description}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => router.push(`/dashboard/groups/${group.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 mb-4">You haven't created any groups yet.</p>
          )}
          <Button 
            className="mt-4" 
            onClick={() => router.push('/dashboard/groups/create')}
          >
            Create a group
          </Button>
        </div>
        
        <div className="p-6 rounded-lg border border-zinc-200 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Your Subscriptions</h2>
          <p className="text-zinc-500 mb-4">No active subscriptions.</p>
          <Button disabled>Add a subscription</Button>
          <p className="text-xs text-zinc-400 mt-2">
            You need to create or join a group first to add subscriptions.
          </p>
        </div>
      </div>
    </div>
  );
} 