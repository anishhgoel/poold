import { GroupForm } from '@/components/groups/group-form';

export default function CreateGroupPage() {
  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Create a Group</h1>
      <GroupForm />
    </div>
  );
} 