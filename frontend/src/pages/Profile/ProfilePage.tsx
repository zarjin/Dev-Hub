import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateUserProfile } from '../../features/users/userSlice';
import { setCurrentUser } from '../../features/auth/authSlice';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { formatDate } from '../../lib/utils';
import { User, AtSign, Calendar, Check, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ProfileFormData {
  name: string;
  username: string;
  avatar: string;
}

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks } = useAppSelector((state) => state.task);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
      avatar: user?.avatar || '',
    },
  });

  const onUpdateProfile = async (data: ProfileFormData) => {
    if (!user) return;
    try {
      const updated = await dispatch(
        updateUserProfile({
          id: user._id,
          updates: data,
        })
      ).unwrap();
      dispatch(setCurrentUser(updated));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const myAssignedTasks = tasks.filter((t) => t.assignedTo === user?._id);
  const myCompletedTasks = myAssignedTasks.filter((t) => t.status === 'completed');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Developer Profile</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal details, workspace username, and avatar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Identity Card */}
        <Card className="p-6 text-center flex flex-col items-center">
          <Avatar src={user?.avatar} name={user?.name} size="xl" className="mb-4" />
          <h2 className="text-base font-bold text-white">{user?.name}</h2>
          <p className="text-xs font-mono text-devhub-400">@{user?.username}</p>
          <p className="text-xs text-slate-400 mt-1">{user?.email}</p>

          <div className="w-full grid grid-cols-2 gap-2 mt-6 pt-6 border-t border-surface-border text-center">
            <div className="p-2.5 rounded-xl bg-surface-elevated">
              <span className="text-xs text-slate-400">Assigned</span>
              <p className="text-lg font-bold font-mono text-white mt-0.5">
                {myAssignedTasks.length}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-elevated">
              <span className="text-xs text-emerald-400">Completed</span>
              <p className="text-lg font-bold font-mono text-emerald-300 mt-0.5">
                {myCompletedTasks.length}
              </p>
            </div>
          </div>

          <div className="mt-4 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Member since {formatDate(user?.createdAt)}</span>
          </div>
        </Card>

        {/* Profile Edit Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Edit Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            {savedSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Full Name"
                leftIcon={<User className="h-4 w-4" />}
                {...register('name', { required: true })}
              />

              <Input
                label="Username"
                placeholder="username"
                leftIcon={<AtSign className="h-4 w-4" />}
                {...register('username', { required: true })}
              />

              <Input
                label="Avatar URL"
                placeholder="https://example.com/avatar.jpg"
                {...register('avatar')}
              />

              <div className="flex justify-end pt-3 border-t border-surface-border">
                <Button type="submit" isLoading={isSubmitting} leftIcon={<Save className="h-4 w-4" />}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
