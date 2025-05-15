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
  created_by: string;
}

interface GroupMember {
  id: string;
  user_id: string;
  role: string;
  profile?: {
    display_name: string;
    username: string;
  };
}

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      setIsLoading(true);
      try {
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          router.push('/auth');
          return;
        }
        
        setCurrentUserId(userData.user.id);
        
        // Fetch group details
        const { data: groupData, error: groupError } = await supabase
          .from('groups')
          .select('*')
          .eq('id', params.id)
          .single();
        
        if (groupError) throw groupError;
        setGroup(groupData);
        
        // Fetch group members
        const { data: membersData, error: membersError } = await supabase
          .from('group_members')
          .select(`
            id,
            user_id,
            role,
            profiles:user_id (
              display_name,
              username
            )
          `)
          .eq('group_id', params.id);
        
        if (membersError) throw membersError;
        setMembers(membersData);
        
        // Check if current user is a member
        const userMembership = membersData.find((m: any) => m.user_id === userData.user.id);
        if (userMembership) {
          setIsMember(true);
          setIsAdmin(userMembership.role === 'admin');
        }
        
      } catch (error) {
        console.error('Error fetching group details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGroupDetails();
  }, [supabase, params.id, router]);
  
  const handleInvite = () => {
    // Will implement invitation functionality later
    console.log('Invite members to', params.id);
  };
  
  if (isLoading) {
    return <div className="text-center py-12">Loading group information...</div>;
  }
  
  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4">Group not found</h2>
        <Button onClick={() => router.push('/dashboard/groups')}>
          Back to Groups
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">{group.name}</h1>
          <p className="text-zinc-500">{group.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/groups')}>
            Back to Groups
          </Button>
          {isAdmin && (
            <Button onClick={handleInvite}>
              Invite Members
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="border border-zinc-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Subscriptions</h2>
            <p className="text-zinc-500 mb-4">No subscriptions added yet.</p>
            {isAdmin && (
              <Button>Add Subscription</Button>
            )}
          </div>
          
          <div className="border border-zinc-200 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Activity</h2>
            <p className="text-zinc-500">No recent activity.</p>
          </div>
        </div>
        
        <div>
          <div className="border border-zinc-200 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Members ({members.length})</h2>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-sm">
                      {member.profile?.display_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="font-medium">
                        {member.profile?.display_name || 'User'}
                        {member.user_id === currentUserId && ' (You)'}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {member.role === 'admin' ? 'Admin' : 'Member'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 