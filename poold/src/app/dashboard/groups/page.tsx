'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Group {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function GroupsPage() {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Groups</h1>
        <Button onClick={() => router.push('/dashboard/groups/create')}>
          Create Group
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-zinc-500">Loading groups...</p>
        </div>
      ) : groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Link 
              key={group.id} 
              href={`/dashboard/groups/${group.id}`}
              className="block p-6 rounded-lg border border-zinc-200 shadow-sm hover:shadow transition-shadow"
            >
              <h2 className="text-lg font-medium mb-2">{group.name}</h2>
              <p className="text-zinc-500 mb-4 line-clamp-2">{group.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">
                  Created {new Date(group.created_at).toLocaleDateString()}
                </span>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-zinc-200 rounded-lg bg-zinc-50">
          <h2 className="text-xl font-medium mb-2">No groups yet</h2>
          <p className="text-zinc-500 mb-6">Create your first group to start sharing subscriptions</p>
          <Button onClick={() => router.push('/dashboard/groups/create')}>
            Create Your First Group
          </Button>
        </div>
      )}
    </div>
  );
} 